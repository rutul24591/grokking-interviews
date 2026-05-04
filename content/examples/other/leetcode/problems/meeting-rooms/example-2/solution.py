def can_attend_meetings_two_arrays(intervals):
    starts = sorted([s for s, _ in intervals])
    ends = sorted([e for _, e in intervals])
    for i in range(1, len(starts)):
        if starts[i] < ends[i - 1]:
            return False
    return True


if __name__ == "__main__":
    print(can_attend_meetings_two_arrays([[0, 30], [5, 10], [15, 20]]))
    print(can_attend_meetings_two_arrays([[7, 10], [2, 4]]))
