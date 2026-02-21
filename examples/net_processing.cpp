// Example demonstrating the fix for calling SyncWithValidationInterfaceQueue after disconnecting
// This is a simplified example based on Bitcoin Core's net_processing pattern

#include <memory>
#include <vector>

// Forward declarations (would be in actual headers)
class CNode;
class CConnman;
class ValidationInterface;

// Mock function declarations
void SyncWithValidationInterfaceQueue();
void DisconnectNode(CNode* node);

/**
 * Handle peer disconnection
 * 
 * IMPORTANT: After disconnecting a peer, we must call SyncWithValidationInterfaceQueue()
 * to ensure all validation interface callbacks are processed before the peer object
 * is destroyed. This prevents race conditions where callbacks might reference
 * the disconnected peer.
 */
void ProcessDisconnect(CNode* pfrom, CConnman* connman) {
    // Perform disconnection
    DisconnectNode(pfrom);
    
    // CRITICAL FIX: Synchronize with validation interface queue after disconnecting
    // This ensures all pending validation callbacks are processed before we proceed
    // Without this, there could be race conditions where validation callbacks
    // try to access the disconnected peer, leading to undefined behavior
    SyncWithValidationInterfaceQueue();
}

/**
 * Alternative pattern: Disconnect multiple peers
 */
void ProcessMultipleDisconnects(std::vector<CNode*> nodes, CConnman* connman) {
    // Disconnect all nodes
    for (CNode* node : nodes) {
        DisconnectNode(node);
    }
    
    // CRITICAL FIX: Single sync after all disconnections
    // More efficient than syncing after each individual disconnect
    SyncWithValidationInterfaceQueue();
}

/**
 * Example showing the WRONG way (without sync)
 * DO NOT USE THIS PATTERN
 */
void ProcessDisconnectWrong(CNode* pfrom, CConnman* connman) {
    // Perform disconnection
    DisconnectNode(pfrom);
    
    // BUG: Missing SyncWithValidationInterfaceQueue() call
    // This can lead to race conditions and crashes
    
    // If we proceed here without syncing, pending validation callbacks
    // might still reference the disconnected peer
}
