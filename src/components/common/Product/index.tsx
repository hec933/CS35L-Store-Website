import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import Text from '@/components/common/Text';

interface ProductProps {
  title: string;
  price: number;
  created_at: string;
  image_url: string;
  quantity: number;
}

dayjs.extend(relativeTime).locale('en');

export default function Product({
  title,
  price,
  created_at,
  image_url,
  quantity,
}: ProductProps) {
  return (
    <div className="flex flex-col border border-slate-300 relative">
      {quantity === 0 && (
        <div className="absolute top-0 left-0 w-full h-full bg-slate-900 opacity-70 flex justify-center items-center">
          <Text color="white">Sold Out</Text>
        </div>
      )}
      <div
        className="h-36 bg-cover bg-center"
        style={{ backgroundImage: `url(${image_url})` }}
      />
      <div className="h-20 flex flex-col px-3 justify-center">
        <Text className="text-ellipsis overflow-hidden whitespace-nowrap block">
          {title}
        </Text>
        <div className="flex justify-between">
          <div>
            <Text weight="bold">
              {'$ ' +
                new Intl.NumberFormat('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(price)}
            </Text>
          </div>
          <Text weight="light" color="grey" size="sm">
            {dayjs(created_at).fromNow()}
          </Text>
        </div>
      </div>
    </div>
  );
}
