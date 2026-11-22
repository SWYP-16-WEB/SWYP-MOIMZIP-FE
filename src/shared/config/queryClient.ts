import { isServer, QueryClient } from '@tanstack/react-query';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
  // 서버 렌더링 간 사용자 캐시 공유 방지
  if (isServer) {
    return createQueryClient();
  }

  // 브라우저에서는 재렌더링·Suspense 재시도에도 같은 클라이언트 유지
  browserQueryClient ??= createQueryClient();

  return browserQueryClient;
};
