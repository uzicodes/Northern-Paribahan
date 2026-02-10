import { prisma } from "@/lib/db";

// Force dynamic rendering to see latest bookings
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const bookings = await prisma.booking.findMany({
        include: {
            user: true,
            seat: {
                include: {
                    bus: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase tracking-wider border-b-2 dark:border-neutral-600 bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4">Booking ID</th>
                            <th scope="col" className="px-6 py-4">User</th>
                            <th scope="col" className="px-6 py-4">Bus</th>
                            <th scope="col" className="px-6 py-4">Seat</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                            <th scope="col" className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="border-b dark:border-neutral-600 hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{booking.id.slice(-6)}...</td>
                                <td className="px-6 py-4">{booking.user?.email || "N/A"}</td>
                                <td className="px-6 py-4">{booking.seat.bus.name}</td>
                                <td className="px-6 py-4">{booking.seat.seatNumber}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{booking.createdAt.toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No bookings found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
