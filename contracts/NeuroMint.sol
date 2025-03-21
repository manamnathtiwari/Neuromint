// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NeuroMint is ReentrancyGuard, Ownable {
    // --- Constants and Immutables ---
    uint256 public constant DEPOSIT_AMOUNT = 0.01 ether;
    uint256 public constant MAX_DEADLINE_DURATION = 30 days;
    
    // --- Structs ---
    struct Project {
        string repoLink;
        uint256 deadline;
        bool rewarded;
        uint256 depositAmount;
    }
    
    // --- State Variables ---
    mapping(address => Project) public projects;
    
    // --- Events ---
    event ProjectSubmitted(address indexed user, string repoLink, uint256 deadline);
    event RewardReleased(address indexed user, uint256 rewardAmount);
    
    // --- Constructor ---
    constructor() Ownable(msg.sender) {}
    
    // --- External Functions ---
    
    /// @notice Submit a new project with repository link and deadline
    /// @param _repoLink GitHub repository link
    /// @param _deadline UNIX timestamp for project deadline
    function submitProject(string calldata _repoLink, uint256 _deadline) external payable nonReentrant {
        require(msg.value == DEPOSIT_AMOUNT, "Incorrect deposit amount");
        require(bytes(_repoLink).length > 0, "Repository link required");
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(_deadline <= block.timestamp + MAX_DEADLINE_DURATION, "Deadline too far");
        
        projects[msg.sender] = Project({
            repoLink: _repoLink,
            deadline: _deadline,
            rewarded: false,
            depositAmount: msg.value
        });
        
        emit ProjectSubmitted(msg.sender, _repoLink, _deadline);
    }
    
    /// @notice Release reward to user if project is validated
    /// @param _user Address of the user to reward
    /// @param _bonus Additional bonus amount to reward
    function releaseReward(address _user, uint256 _bonus) external onlyOwner nonReentrant {
        Project storage proj = projects[_user];
        require(!proj.rewarded, "Reward already released");
        require(proj.depositAmount > 0, "No deposit found");
        require(block.timestamp <= proj.deadline, "Project deadline passed");
        
        proj.rewarded = true;
        uint256 rewardAmount = proj.depositAmount + _bonus;
        
        (bool sent,) = payable(_user).call{value: rewardAmount}("");
        require(sent, "Reward transfer failed");
        
        emit RewardReleased(_user, rewardAmount);
    }
    
    /// @notice Get project details for a user
    /// @param _user Address of the user
    /// @return Project struct containing project details
    function getProject(address _user) external view returns (Project memory) {
        return projects[_user];
    }
    
    // --- Receive Function ---
    receive() external payable {}
} 