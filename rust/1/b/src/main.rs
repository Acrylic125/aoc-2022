fn main() {
    // Read from data.txt
    let data = std::fs::read_to_string("data.txt").unwrap();

    // Split data into lines
    let lines = data.split("\n\n");

    let mut elves_load = lines
        .map(|line| {
            if line == "" {
                return 0;
            }

            let calories = line
                .split("\n")
                .map(|calaorie| match calaorie.parse::<i32>() {
                    Ok(c) => c,
                    Err(_) => 0,
                })
                .sum::<i32>();
            return calories;
        })
        // Convert to Vec.
        .collect::<Vec<i32>>();

    // Sort elves load in descending order.

    // Top 3 elves load.
    elves_load.sort_by(|a, b| b.cmp(a));

    // Sum top 3 from total top3.
    let total = elves_load.iter().take(3).sum::<i32>();
    println!("Total: {}", total)
}
