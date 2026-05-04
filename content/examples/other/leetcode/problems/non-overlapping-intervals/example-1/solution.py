def erase_overlap_intervals_sort_start(intervals):
    intervals.sort(key=lambda x: x[0])
    if not intervals:
        return 0
    removed = 0
    prev_end = intervals[0][1]
    for s, e in intervals[1:]:
        if s < prev_end:
            removed += 1
            prev_end = min(prev_end, e)
        else:
            prev_end = e
    return removed


if __name__ == "__main__":
    print(erase_overlap_intervals_sort_start([[1, 2], [2, 3], [3, 4], [1, 3]]))
