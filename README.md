###SockSort()
## An O(n^2) algorithm for sorting socks.

Code to swap canvas elements from [here](http://stackoverflow.com/questions/698301/is-there-a-native-jquery-function-to-switch-elements)

This program randomly generates some socks and uses skeleton to display them.
The socks are then sorted based on attributes including sock color and stripe
 color to calculate the best way to match up the socks to get the closest pairs.
Currently, this is configured to generate 16 socks in a four by four grid.

To sort, the program has to calculate the scores of pairing any of the tuples. Originally,
this was intended to be done with a two dimensional array, but because the tuples
are commutative (we don't care what order each sock is when it's in its own pairing),
only half of the matrix has to be determined. This would work well with JavaScript
jagged areas. However, if an O(n^2) pass through the tuples occurs, for the inconvenience
of one global variable, an array of lists can be built where each list represents
a distinct score. So, once the array is no longer needed, it turned out the best
way to work with building these lists is to use jQuery. So, a jQuery object ($matchLists) that
never happens to be made visible or even connect to the DOM is constructed.

In a later iteration, this global "matchLists" element could be used to display
on the webpage details of the sort as it occurs, rather than the merely perform
the entertaining swap of socks visually. Although the entertaining swap of socks
does illustrate the sorting process, it does not illumniate the tasks being
performed to complete the sorting process, such as watching the lists of common
scores get built and then traversed.
