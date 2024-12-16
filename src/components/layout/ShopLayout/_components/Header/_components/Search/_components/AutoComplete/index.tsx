import { throttle } from 'lodash';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import Text from '@/components/common/Text';
import { fetchWithAuthToken } from '@/utils/auth';
import { addRecentKeyword } from '@/utils/localstorage';

type Props = {
  query: string;
  handleClose: () => void;
};

export default function AutoComplete({ query, handleClose }: Props) {
  const router = useRouter();
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleSearch = useMemo(
    () =>
      throttle(async (query: string) => {
        if (!query) {
          setKeywords([]);
          return;
        }
        try {
          const { data } = await fetchWithAuthToken('/api/products', 'POST', {
            action: 'fetchKeyword',
            keyword: query,
            fromPage: 0,
            toPage: 2,
          });
          setKeywords(data.map(({ title }: { title: string }) => title));
        } catch (error) {
          console.error('Error fetching autocomplete keywords:', error);
          setKeywords([]);
        }
      }, 500),
    []
  );

  useEffect(() => {
    handleSearch(query);
  }, [handleSearch, query]);

  const handleKeywordClick = (keyword: string) => {
    addRecentKeyword(keyword);
    router.push(`/search?query=${encodeURIComponent(keyword)}`);
    handleClose();
  };

  return (
    <div className="flex flex-col h-full">
      {keywords.length > 0 ? (
        <ul className="bg-white border border-gray-300 rounded-md shadow-md">
          {keywords.map((keyword, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleKeywordClick(keyword)}
            >
              <Text size="sm">{keyword}</Text>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 py-4">
          <Text size="sm">No suggestions available</Text>
        </div>
      )}
    </div>
  );
}
