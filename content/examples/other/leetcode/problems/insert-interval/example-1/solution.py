def insert_interval_linear(intervals, new_interval):
    out = []
    ns, ne = new_interval
    i = 0

    while i < len(intervals) and intervals[i][1] < ns:
        out.append(intervals[i])
        i += 1

    while i < len(intervals) and intervals[i][0] <= ne:
        ns = min(ns, intervals[i][0])
        ne = max(ne, intervals[i][1])
        i += 1
    out.append([ns, ne])

    while i < len(intervals):
        out.append(intervals[i])
        i += 1

    return out


if __name__ == "__main__":
    print(insert_interval_linear([[1, 3], [6, 9]], [2, 5]))
