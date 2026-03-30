# Periodic Background Sync — Examples

This topic has three runnable examples:

- `example-1`: Next.js app that attempts periodic sync registration and falls back to refresh-on-visible
- `example-2`: Scheduling policy calculator (Node) for interval selection under battery/network constraints
- `example-3`: Next.js conditional refresh flow using `ETag` / `If-None-Match` to keep background refresh cheap

Each example folder contains its own `README.md` with run instructions.
      startPolling();
    } else {
      stopPolling();
    }
  });

  if (document.visibilityState === 'visible') {
    startPolling();
  }
}

// React hook version
function usePeriodicRefresh(url, interval = 300000) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function refresh() {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (res.ok) setData(await res.json());
      } catch {}
    }

    refresh(); // Initial fetch
    const id = setInterval(refresh, interval);

    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, [url, interval]);

  return data;
}
```
