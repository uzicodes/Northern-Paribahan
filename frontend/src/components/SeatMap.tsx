type Seat = {
  id: string;
  seatNumber: string;
  isBooked: boolean;
};

type Props = {
  seats: Seat[];
  onSelect?: (seat: Seat) => void;
};

export default function SeatMap({ seats, onSelect }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {seats.map((s) => (
        <button
          key={s.id}
          disabled={s.isBooked}
          onClick={() => onSelect?.(s)}
          className={`px-3 py-2 rounded border text-sm ${s.isBooked ? 'bg-gray-200 text-gray-400' : 'bg-green-50 hover:bg-green-100 border-green-300'}`}
        >
          {s.seatNumber}
        </button>
      ))}
    </div>
  );
}

