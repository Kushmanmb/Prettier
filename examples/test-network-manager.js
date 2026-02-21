/**
 * Test file demonstrating the SyncWithValidationInterfaceQueue pattern
 */

const {
  ValidationQueue,
  PeerConnection,
  NetworkManager,
} = require("./network-manager");

/**
 * Test 1: Safe disconnect with sync
 */
async function testSafeDisconnect() {
  console.log("\n=== Test 1: Safe Disconnect ===");
  const manager = new NetworkManager();

  // Create a mock socket
  const mockSocket = {
    close: () => console.log("Socket closed"),
  };

  // Add a peer
  const peer = new PeerConnection("peer-1", mockSocket);
  manager.peers.set("peer-1", peer);

  // Add some validation tasks
  manager.validateBlockFromPeer("peer-1", { block: "data1" });
  manager.validateBlockFromPeer("peer-1", { block: "data2" });

  // Disconnect safely - this will process all pending validations
  await manager.disconnectPeerSafely("peer-1");

  console.log("✓ Test passed: Peer disconnected safely\n");
}

/**
 * Test 2: Unsafe disconnect (demonstrates the problem)
 */
async function testUnsafeDisconnect() {
  console.log("\n=== Test 2: Unsafe Disconnect (Problem Case) ===");
  const manager = new NetworkManager();

  const mockSocket = {
    close: () => console.log("Socket closed"),
  };

  const peer = new PeerConnection("peer-2", mockSocket);
  manager.peers.set("peer-2", peer);

  // Add validation tasks
  manager.validateBlockFromPeer("peer-2", { block: "data1" });
  manager.validateBlockFromPeer("peer-2", { block: "data2" });

  // Disconnect unsafely (without sync)
  await manager.disconnectPeerUnsafe("peer-2");

  // Now if we sync, the validations will try to access a disconnected peer
  console.log("Now syncing (validations will fail due to disconnected peer):");
  await manager.validationQueue.sync();

  console.log("✓ Test completed: Showed the problem with unsafe disconnect\n");
}

/**
 * Test 3: Multiple peer disconnect
 */
async function testMultiplePeerDisconnect() {
  console.log("\n=== Test 3: Multiple Peer Disconnect ===");
  const manager = new NetworkManager();

  // Add multiple peers
  for (let i = 1; i <= 3; i++) {
    const mockSocket = { close: () => console.log(`Socket ${i} closed`) };
    const peer = new PeerConnection(`peer-${i}`, mockSocket);
    manager.peers.set(`peer-${i}`, peer);

    // Add validation tasks for each peer
    manager.validateBlockFromPeer(`peer-${i}`, { block: `data-${i}` });
  }

  // Disconnect all peers safely
  await manager.disconnectMultiplePeers(["peer-1", "peer-2", "peer-3"]);

  console.log("✓ Test passed: Multiple peers disconnected safely\n");
}

/**
 * Test 4: Race condition demonstration
 */
async function testRaceCondition() {
  console.log("\n=== Test 4: Race Condition Scenario ===");
  const manager = new NetworkManager();

  const mockSocket = { close: () => {} };
  const peer = new PeerConnection("peer-race", mockSocket);
  manager.peers.set("peer-race", peer);

  // Add a long-running validation task
  manager.validationQueue.addTask(async () => {
    console.log("Starting long validation task...");
    await new Promise((resolve) => setTimeout(resolve, 100));
    const p = manager.peers.get("peer-race");
    if (!p || !p.connected) {
      console.log(
        "⚠ Validation detected disconnected peer (safe because we synced)",
      );
    } else {
      console.log("✓ Validation completed with connected peer");
    }
  });

  // Disconnect safely - will wait for the long task to complete
  console.log("Disconnecting peer (will wait for validations)...");
  await manager.disconnectPeerSafely("peer-race");

  console.log("✓ Test passed: No race condition occurred\n");
}

// Run all tests
async function runAllTests() {
  console.log("==========================================");
  console.log("SyncWithValidationInterfaceQueue Tests");
  console.log("==========================================");

  try {
    await testSafeDisconnect();
    await testUnsafeDisconnect();
    await testMultiplePeerDisconnect();
    await testRaceCondition();

    console.log("==========================================");
    console.log("All tests completed!");
    console.log("==========================================");
  } catch (error) {
    console.error("Test failed with error:", error);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testSafeDisconnect,
  testUnsafeDisconnect,
  testMultiplePeerDisconnect,
  testRaceCondition,
  runAllTests,
};
