"use client";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { increment, decrement } from "@/lib/features/counter/counterSlice";
import { Button } from "@/components/ui/button";

export default function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold">Counter: {count}</h2>
      <div className="flex gap-2">
        <Button onClick={() => dispatch(decrement())}>-</Button>
        <Button onClick={() => dispatch(increment())}>+</Button>
      </div>
    </div>
  );
}
