fn main() {
    println!("Hello, world!");

    // let mut elves: Vec<String = Vec::new();

    // Read from data.txt
    let data = std::fs::read_to_string("data.txt").unwrap();

    // Split data into lines
    let lines = data.split("\n\n");
    let mut highest = 0;

    lines.for_each(|line| {
        if line == "" {
            return;
        }

        let calories = line
            .split("\n")
            .map(|calaorie| match calaorie.parse::<i32>() {
                Ok(c) => c,
                Err(_) => 0,
            })
            .sum::<i32>();
        highest = if calories > highest {
            calories
        } else {
            highest
        };
        println!("{} {}", calories, highest);
    });

    println!("{}", highest)
}
