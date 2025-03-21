export const NEUROMINT_ADDRESS = process.env
  .NEXT_PUBLIC_NEUROMINT_ADDRESS as `0x${string}`;

export const NEUROMINT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'repoLink',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256'
      }
    ],
    name: 'ProjectSubmitted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'rewardAmount',
        type: 'uint256'
      }
    ],
    name: 'RewardReleased',
    type: 'event'
  },
  {
    inputs: [],
    name: 'DEPOSIT_AMOUNT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address'
      }
    ],
    name: 'getProject',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'repoLink',
            type: 'string'
          },
          {
            internalType: 'uint256',
            name: 'deadline',
            type: 'uint256'
          },
          {
            internalType: 'bool',
            name: 'rewarded',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'depositAmount',
            type: 'uint256'
          }
        ],
        internalType: 'struct NeuroMint.Project',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: '_bonus',
        type: 'uint256'
      }
    ],
    name: 'releaseReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_repoLink',
        type: 'string'
      },
      {
        internalType: 'uint256',
        name: '_deadline',
        type: 'uint256'
      }
    ],
    name: 'submitProject',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    stateMutability: 'payable',
    type: 'receive'
  }
] as const;
