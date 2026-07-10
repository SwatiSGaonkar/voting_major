// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Voting
 * @dev Secure voting system integrated with Zero-Knowledge Proofs
 * 
 * Features:
 * - Nullifier-based duplicate vote prevention
 * - Vote counts per candidate (1, 2, 3)
 * - Event logging for transparency
 * - Owner control
 */
contract Voting {
    
    // ============ STATE VARIABLES ============
    
    /// @dev Vote counts per candidate
    mapping(uint256 => uint256) public votes;
    
    /// @dev Track used nullifiers to prevent double voting
    /// nullifier => hasVoted
    mapping(bytes32 => bool) public nullifierUsed;
    
    /// @dev Contract owner (for future admin features)
    address public owner;
    
    // ============ EVENTS ============
    
    /// @dev Emitted when a vote is successfully cast
    event VoteCast(
        uint256 indexed candidate,
        bytes32 indexed nullifier,
        uint256 timestamp
    );
    
    /// @dev Emitted when a vote attempt fails
    event VoteRejected(
        string reason,
        bytes32 nullifier,
        uint256 timestamp
    );
    
    // ============ MODIFIERS ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        owner = msg.sender;
    }
    
    // ============ VOTING FUNCTIONS ============
    
    /**
     * @dev Cast a vote (called from backend after ZKP verification)
     * @param _candidate The candidate ID (1, 2, or 3)
     * @param _nullifier The nullifier hash from ZKP proof (prevents double voting)
     * 
     * Requirements:
     * - Candidate must be 1, 2, or 3
     * - Nullifier must not have been used before
     */
    function castVote(uint256 _candidate, bytes32 _nullifier) external {
        
        // Validate candidate
        require(_candidate >= 1 && _candidate <= 3, "Invalid candidate ID");
        
        // Check if nullifier already used (duplicate vote prevention)
        require(!nullifierUsed[_nullifier], "Duplicate vote: Nullifier already used");
        
        // Mark nullifier as used
        nullifierUsed[_nullifier] = true;
        
        // Increment vote count
        votes[_candidate]++;
        
        // Emit success event
        emit VoteCast(_candidate, _nullifier, block.timestamp);
    }
    
    // ============ QUERY FUNCTIONS ============
    
    /**
     * @dev Get vote count for a specific candidate
     * @param _candidate The candidate ID
     * @return Vote count for the candidate
     */
    function getVotes(uint256 _candidate) public view returns (uint256) {
        require(_candidate >= 1 && _candidate <= 3, "Invalid candidate ID");
        return votes[_candidate];
    }
    
    /**
     * @dev Check if a nullifier has already voted
     * @param _nullifier The nullifier hash to check
     * @return True if the nullifier has voted, false otherwise
     */
    function hasVoted(bytes32 _nullifier) public view returns (bool) {
        return nullifierUsed[_nullifier];
    }
    
    /**
     * @dev Get all election results
     * @return Array [votes_candidate1, votes_candidate2, votes_candidate3, total_votes]
     */
    function getResults() public view returns (uint256[4] memory) {
        uint256 total = votes[1] + votes[2] + votes[3];
        return [votes[1], votes[2], votes[3], total];
    }
    
    /**
     * @dev Get total votes cast
     * @return Total number of votes
     */
    function getTotalVotes() public view returns (uint256) {
        return votes[1] + votes[2] + votes[3];
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Reset voting state (only owner, for testing)
     */
    function resetVotes() external onlyOwner {
        votes[1] = 0;
        votes[2] = 0;
        votes[3] = 0;
    }
}
