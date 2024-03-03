'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Product } from '@/lib/types';
import { catchError } from '@/lib/utils';
import { filterProducts } from '@/lib/actions/product';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface QueriedProduct {
  id: Product['id'];
  name: Product['name'];
  categories: string[];
}

export default function ProductsCommandMenu() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [data, setData] = React.useState<QueriedProduct[] | null>(null);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (debouncedQuery.length <= 0) {
      setData(null);
      return;
    }

    async function fetchData() {
      try {
        const data = await filterProducts(debouncedQuery);
        setData(data);
      } catch (err) {
        catchError(err);
      }
    }

    startTransition(fetchData);

    return () => setData(null);
  }, [debouncedQuery]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = React.useCallback((callback: () => unknown) => {
    setOpen(false);
    callback();
  }, []);

  return (
    <>
      <Button variant="outline" className="relative max-xs:px-2" onClick={() => setOpen(true)}>
        <MagnifyingGlassIcon className="size-4 xl:mr-2" />
        <p className="ml-1 w-20 text-start text-xs text-muted-foreground max-xs:hidden">검색.. </p>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 max-xs:hidden">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) setQuery('');
        }}
        className="top-48 translate-y-0"
      >
        <CommandInput placeholder="상품명을 입력하세요.." value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandGroup className="capitalize" heading="Products">
            <CommandEmpty>No results found.</CommandEmpty>
            {isPending ? (
              <div className="space-y-1 overflow-hidden px-1 py-2">
                <Skeleton className="h-4 w-10 rounded" />
                <Skeleton className="h-8 rounded-sm" />
                <Skeleton className="h-8 rounded-sm" />
              </div>
            ) : (
              data?.map((item) => (
                <CommandItem
                  key={item.id}
                  className="h-9"
                  value={item.name}
                  onSelect={() => handleSelect(() => router.push(`/product/${item.name}`))}
                >
                  <span className="truncate">{item.name}</span>
                </CommandItem>
              ))
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
