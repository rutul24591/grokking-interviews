def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    out = []
    for s, e in intervals:
        if not out or s > out[-1][1]:
            out.append([s, e])
        else:
            out[-1][1] = max(out[-1][1], e)
    return out


if __name__ == "__main__":
    print(merge_intervals([[1, 3], [2, 6], [8, 10], [15, 18]]))
