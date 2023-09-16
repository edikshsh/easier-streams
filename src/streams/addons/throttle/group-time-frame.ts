export class GroupTimeFrame {
    activeTimestamp = 0;
    itemsLeft: number;
    constructor(private originalCapacity: number) {
        this.itemsLeft = originalCapacity;
    }

    decItem() {
        this.itemsLeft--;
    }

    shouldRefresh() {
        return this.itemsLeft <= 0;
    }

    refresh(newTimestamp: number) {
        this.activeTimestamp = newTimestamp;
        this.itemsLeft = this.originalCapacity;
    }
}
