import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-primary">
                    Northern Paribahan
                </Link>
                <div className="space-x-4">
                    <Link href="/" className="text-gray-600 hover:text-primary transition">
                        Home
                    </Link>
                    <Link href="/admin" className="text-gray-600 hover:text-primary transition">
                        Admin
                    </Link>
                    {/* Add more links or Auth buttons here */}
                </div>
            </div>
        </nav>
    );
}
