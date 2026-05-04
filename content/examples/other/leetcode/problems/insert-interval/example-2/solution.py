def insert_interval(intervals, new_interval):
    out = []
    ns, ne = new_interval
    for s, e in intervals:
        if e < ns:
            out.append([s, e])
        elif s > ne:
            out.append([ns, ne])
            ns, ne = s, e
        else:
            ns = min(ns, s)
            ne = max(ne, e)
    out.append([ns, ne])
    return out


if __name__ == "__main__":
    print(insert_interval([[1, 3], [6, 9]], [2, 5]))
