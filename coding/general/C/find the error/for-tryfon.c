/*
 * test.c
 “Please find a bug in my code based on finding whether a positive integer can be expressed as pow(a, b) where a and b are non-negative integers and b > 1. My code outputs for 1000 (103), 0 where it should be 1. Please find the bug…”
 */
#include <stdio.h>

int main(void)
{
    int A = 1000;
    printf ("isPower(1000) => %i\n", isPower(A));
    return 0;
}


/*
 * pow.c
 * @Input A : Integer
 *  * @Output Integer
 */
int isPower(int A)
{
    if (A == 1)
        return 1;
    else
    {
        int i;
        if (A % 2 == 0) /* even */
        {
            for (i = 2; i <= sqrt(A); i = i + 2) {
                if (pow(i, (int) (log(A)/log(i))) == A)
                    return 1;
            }
        }
        else /* odd */
        {
            int i;
            for (i = 3; i <= sqrt(A); i = i + 2)
                if (pow(i, (int) (log(A)/log(i))) == A)
                    return 1;
        }
        return 0;
    }
}
