export type PrivilegeTier = {
  name: string;
  benefits: string;
  color: string;
};

export function getAccountPrivilege(totalBookings: number): PrivilegeTier {
  if (totalBookings >= 50) {
    return { name: 'Platinum', benefits: '15% Off All Routes + Priority Support', color: 'text-purple-700 bg-purple-100 border-purple-300' };
  } 
  if (totalBookings >= 25) {
    return { name: 'Gold', benefits: '10% Off Premium Buses', color: 'text-yellow-700 bg-yellow-100 border-yellow-300' };
  } 
  if (totalBookings >= 10) {
    return { name: 'Silver', benefits: '5% Off Next Ride', color: 'text-slate-700 bg-slate-200 border-slate-300' };
  }
  
  return { name: 'Standard', benefits: 'Earn points on every ride', color: 'text-gray-700 bg-gray-100 border-gray-200' };
}

