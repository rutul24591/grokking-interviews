def erase_overlap_intervals_sort_end(intervals):
    intervals.sort(key=lambda x: x[1])
    kept = 0
    prev_end = float("-inf")
    for s, e in intervals:
        if s >= prev_end:
            kept += 1
            prev_end = e
    return len(intervals) - kept


if __name__ == "__main__":
    print(erase_overlap_intervals_sort_end([[1, 2], [2, 3], [3, 4], [1, 3]]))
