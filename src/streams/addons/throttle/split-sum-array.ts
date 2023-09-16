export function splitSumArray(targetSum: number, length: number): number[] {
    const initialValue = Math.floor(targetSum / length);
    const resultArray = Array(length).fill(initialValue);
    const adjustment = targetSum - initialValue * length;

    for (let i = 0; i < adjustment; i++) {
        resultArray[i]++;
    }

    return resultArray;
}
