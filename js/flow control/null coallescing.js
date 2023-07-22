function calculatePrice(price, tax, description) {
    // The ?? is actually a check against null & undefined.
    price = price ?? 0;
    tax = tax ?? 0.05;
    description = description ?? "Default item";
    const total = price * (1 + tax);
    console.log(`${description} with tax: £${total}`);
}

calculatePrice(100, 0.07, "First item");
calculatePrice(50, 0, "First item");
calculatePrice(100);
