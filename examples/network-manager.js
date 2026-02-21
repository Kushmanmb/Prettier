/**
 * JavaScript/TypeScript equivalent demonstration
 *
 * This example shows how the same pattern of synchronizing after disconnection
 * would apply in a JavaScript/Node.js context (e.g., WebSocket servers, P2P networks)
 */

class ValidationQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  /**
   * Add a validation task to the queue
   */
  addTask(task) {
    this.queue.push(task);
  }

  /**
   * Process all pending validation tasks
   * This is analogous to SyncWithValidationInterfaceQueue() in Bitcoin Core
   */
  async sync() {
    if (this.processing) {
      // Wait for current processing to complete
      await this.waitForCompletion();
    }

    this.processing = true;

    try {
      // Process all queued tasks
      while (this.queue.length > 0) {
        const task = this.queue.shift();
        await task();
      }
    } finally {
      this.processing = false;
    }
  }

  async waitForCompletion() {
    while (this.processing) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
}

class PeerConnection {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.connected = true;
  }

  disconnect() {
    if (this.connected) {
      this.socket.close();
      this.connected = false;
      console.log(`Peer ${this.id} disconnected`);
    }
  }
}

class NetworkManager {
  constructor() {
    this.peers = new Map();
    this.validationQueue = new ValidationQueue();
  }

  /**
   * CORRECT: Disconnect and sync
   * This ensures all pending validation callbacks are processed
   */
  async disconnectPeerSafely(peerId) {
    const peer = this.peers.get(peerId);
    if (!peer) {
      return;
    }

    // Step 1: Disconnect the peer
    peer.disconnect();
    this.peers.delete(peerId);

    // Step 2: CRITICAL FIX - Sync with validation queue
    // This ensures all pending validations referencing this peer are completed
    await this.validationQueue.sync();

    console.log(`Peer ${peerId} safely disconnected and queue synced`);
  }

  /**
   * WRONG: Disconnect without sync (DON'T USE THIS)
   */
  async disconnectPeerUnsafe(peerId) {
    const peer = this.peers.get(peerId);
    if (!peer) {
      return;
    }

    // Disconnect the peer
    peer.disconnect();
    this.peers.delete(peerId);

    // BUG: Missing validation queue sync!
    // Pending validations might still reference this disconnected peer
    // This can lead to errors when those validations execute
  }

  /**
   * Example: Disconnect multiple peers efficiently
   */
  async disconnectMultiplePeers(peerIds) {
    // Disconnect all peers first
    for (const peerId of peerIds) {
      const peer = this.peers.get(peerId);
      if (peer) {
        peer.disconnect();
        this.peers.delete(peerId);
      }
    }

    // Then sync once (more efficient than syncing after each disconnect)
    await this.validationQueue.sync();

    console.log(`${peerIds.length} peers safely disconnected`);
  }

  /**
   * Example validation that might reference a peer
   */
  validateBlockFromPeer(peerId, blockData) {
    this.validationQueue.addTask(async () => {
      const peer = this.peers.get(peerId);
      if (!peer || !peer.connected) {
        console.log(`Cannot validate - peer ${peerId} no longer connected`);
        return;
      }

      // Perform validation with peer reference
      console.log(`Validating block from peer ${peerId}`);
      // ... validation logic ...
    });
  }
}

// Example usage
async function example() {
  const manager = new NetworkManager();

  // Simulate adding a peer
  const mockSocket = { close: () => {} };
  const peer = new PeerConnection("peer-1", mockSocket);
  manager.peers.set("peer-1", peer);

  // Add some validation tasks that reference the peer
  manager.validateBlockFromPeer("peer-1", {
    /* block data */
  });
  manager.validateBlockFromPeer("peer-1", {
    /* block data */
  });

  // Disconnect safely - this will process all pending validations first
  await manager.disconnectPeerSafely("peer-1");

  console.log("All done - no race conditions!");
}

module.exports = {
  ValidationQueue,
  PeerConnection,
  NetworkManager,
};
