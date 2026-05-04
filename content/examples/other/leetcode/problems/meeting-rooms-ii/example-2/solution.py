import heapq


def min_meeting_rooms_heap(intervals):
    intervals.sort(key=lambda x: x[0])
    heap = []
    for start, end in intervals:
        if heap and start >= heap[0]:
            heapq.heappop(heap)
        heapq.heappush(heap, end)
    return len(heap)


if __name__ == "__main__":
    print(min_meeting_rooms_heap([[0, 30], [5, 10], [15, 20]]))
    print(min_meeting_rooms_heap([[7, 10], [2, 4]]))
