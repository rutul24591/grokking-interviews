def min_meeting_rooms_two_arrays(intervals):
    starts = sorted([s for s, _ in intervals])
    ends = sorted([e for _, e in intervals])
    rooms = 0
    end_idx = 0
    for s in starts:
        if s < ends[end_idx]:
            rooms += 1
        else:
            end_idx += 1
    return rooms


if __name__ == "__main__":
    print(min_meeting_rooms_two_arrays([[0, 30], [5, 10], [15, 20]]))
    print(min_meeting_rooms_two_arrays([[7, 10], [2, 4]]))
