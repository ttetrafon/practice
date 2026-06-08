# Zig

## Intro

### Prepacked Libraries

- standard library (std)

```zig
const std = @import("std");
```

### Variables

```zig
<!-- Declaring a variable -->
var my_variable: type = value;

<!-- Declaring a constant -->
const my_constant: type = value;
```

#### Types

- Integers:
  - `i32`
  - `i65`
- Bytes (unsigned integer):
  - `u8`
- Slices: `[]`
  - Slices of bytes are used to represent strings - there is no string type.
- Prepending a type with `?` gives a nullable type.
- Prepending a type with `!` gives a possible error type.

Conversions never happen automatically, instead must be called explicitly (with `@as(cast_type, variable)`).

```zig
const a: i32 = 42;
const b: i64 = 100;

const sum: i64 = a + b; @as(i64, a) + b;
```

#### Structures

```zig
const msg = .{
  .greeting = greeting,
  .name = name,
};
```

### Error Handling

- no support for exceptions
- errors are returned as values
- `try` or `catch` is used to control error flows

```zig
fn parseNumber(s: []const u8): !u32 {
  if (s.len == 0) return error.EmptyInput;
  return std.fmt.parseInt(u32, s, 10);
    catch error.InvalidNumber;
}

pub fn main() !void {
  const answer = parseNumber("42") catch 0;
  const result = try parseNumber("abc");
}
```

### Testing

## Memory Management

- manual, through allocators
- allocators are objects, and can be passed in the code
- allocator types:
  - general purpose heap
  - fast arena
  - fixed-size buffer
  - custom

```zig
fn makeBuffer(alloc: *std.mem.Allocator) ![]u8 {
  return try alloc.alloc(u8, 4);

var gpa std.heap.GeneralPurposeAllocator(.{}){};
const allocator = &gpa.allocator;
var buf = try makeBuffer(allocator);

defer allocator.free(buf);
defer _ = gpa.deinit();

buf.* = "Zig!";
try std.io.getStdOut().writer().print("{s}\n", .{buf});
```

## Compile Time Execution

- `comptime`
