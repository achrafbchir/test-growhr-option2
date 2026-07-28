/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LikeButton } from "@/components/photos/LikeButton";

describe("LikeButton", () => {
  it("shows liked state clearly", () => {
    render(
      <LikeButton
        photoId="p1"
        liked
        likesCount={12}
        onToggle={() => undefined}
      />,
    );

    expect(screen.getByRole("button", { name: "Unlike photo" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows unliked state and calls onToggle", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(
      <LikeButton
        photoId="p1"
        liked={false}
        likesCount={3}
        onToggle={onToggle}
      />,
    );

    const button = screen.getByRole("button", { name: "Like photo" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await user.click(button);
    expect(onToggle).toHaveBeenCalledWith("p1");
  });
});
