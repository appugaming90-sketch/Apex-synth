import { CareerContract } from '../types';

export const CAREER_CONTRACTS: CareerContract[] = [
  {
    id: 'c1',
    name: 'Data Courier Shift',
    reward: 25,
    cooldown: 5,
    description: 'Rapid physical delivery of uncrackable quantum key drives across the lower city corridors.'
  },
  {
    id: 'c2',
    name: 'Broker Security Run',
    reward: 120,
    cooldown: 15,
    description: 'Armed escort escorting high-frequency corporate brokers through contested black-market sectors.'
  },
  {
    id: 'c3',
    name: 'Bio-Clinic Drone Run',
    reward: 450,
    cooldown: 30,
    description: 'Interception and high-speed delivery of cryogenic organ pods to clandestine clinics.'
  },
  {
    id: 'c4',
    name: 'Syndicate Vault Defense',
    reward: 1500,
    cooldown: 60,
    description: 'Hold the frontline against rival syndicate cyber-raiders targeting offshore liquidity reserves.'
  }
];
