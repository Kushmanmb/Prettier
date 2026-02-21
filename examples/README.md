# SyncWithValidationInterfaceQueue After Disconnecting

## Problem

In Bitcoin Core and similar blockchain implementations, when a peer is disconnected, there may be pending validation interface callbacks that reference that peer. If these callbacks are not processed before the peer object is destroyed, it can lead to:

- Race conditions
- Use-after-free errors
- Undefined behavior
- Potential crashes

## Solution

Always call `SyncWithValidationInterfaceQueue()` immediately after disconnecting a peer. This ensures that all pending validation interface callbacks are processed before proceeding.

## Example

### Correct Implementation ✓

```cpp
void ProcessDisconnect(CNode* pfrom, CConnman* connman) {
    // Disconnect the peer
    DisconnectNode(pfrom);

    // CRITICAL: Sync with validation interface queue
    SyncWithValidationInterfaceQueue();
}
```

### Incorrect Implementation ✗

```cpp
void ProcessDisconnectWrong(CNode* pfrom, CConnman* connman) {
    // Disconnect the peer
    DisconnectNode(pfrom);

    // BUG: Missing SyncWithValidationInterfaceQueue()
    // This can cause race conditions!
}
```

## When to Apply This Fix

Call `SyncWithValidationInterfaceQueue()` after:

1. Disconnecting a single peer
2. Disconnecting multiple peers (call once after all disconnects)
3. Any operation that removes a peer from the network

## Performance Considerations

- `SyncWithValidationInterfaceQueue()` is a blocking call
- For multiple disconnects, sync once after all disconnects rather than after each individual disconnect
- This adds a small overhead but prevents critical race conditions

## Files Typically Affected

In Bitcoin Core, this fix would typically be applied in:

- `src/net_processing.cpp` - Main peer processing logic
- Any function that calls disconnect operations
- Peer eviction logic
- Ban/misbehavior handling code

## Related Concepts

- Validation Interface: A notification system for blockchain events
- Queue Synchronization: Ensuring all pending callbacks are processed
- Resource Cleanup: Proper ordering of cleanup operations to prevent use-after-free

## References

This pattern is based on Bitcoin Core's approach to safely handling peer disconnections while maintaining validation interface integrity.
