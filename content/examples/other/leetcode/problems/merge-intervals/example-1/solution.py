def merge_intervals_sort(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = []
    for start, end in intervals:
        if not merged or start > merged[-1][1]:
            merged.append([start, end])
        else:
            merged[-1][1] = max(merged[-1][1], end)
    return merged


if __name__ == "__main__":
    print(merge_intervals_sort([[1, 3], [2, 6], [8, 10], [15, 18]]))
