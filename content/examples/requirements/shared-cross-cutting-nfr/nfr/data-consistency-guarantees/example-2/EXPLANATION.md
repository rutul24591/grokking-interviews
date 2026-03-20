This example focuses on a classic consistency control: **quorums**.

Given replication factor `N`, you choose:
- write quorum `W`
- read quorum `R`

If `R + W > N`, reads are guaranteed to see the latest write (ignoring timing and failures).

