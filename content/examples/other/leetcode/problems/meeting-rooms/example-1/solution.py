def can_attend_meetings_sort(intervals):
    intervals.sort(key=lambda x: x[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i - 1][1]:
            return False
    return True


if __name__ == "__main__":
    print(can_attend_meetings_sort([[0, 30], [5, 10], [15, 20]]))
    print(can_attend_meetings_sort([[7, 10], [2, 4]]))
