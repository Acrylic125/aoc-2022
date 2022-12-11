fn parse_pair(pair_str: &str) -> (u32, u32) {
    let mut pair = pair_str.split("-");
    let first = pair.next().unwrap().parse::<u32>().unwrap();
    let second = pair.next().unwrap().parse::<u32>().unwrap();
    (first, second)
}

fn main() {
    // Read from data.txt
    let data = std::fs::read_to_string("data.txt").unwrap();

    // Split data into lines
    let lines = data.split("\n");

    let mut pair_overlaps: u32 = 0;

    lines.for_each(|line| {
        if line == "" {
            return;
        }

        let mut pairs = line.split(",");

        let first_pair = parse_pair(pairs.next().unwrap());
        let second_pair = parse_pair(pairs.next().unwrap());

        println!("Pair 1: {} {}", first_pair.0, first_pair.1);
        println!("Pair 2: {} {}", second_pair.0, second_pair.1);
        // Check if either lines fully contains the other.
        if first_pair.0 <= second_pair.0 && first_pair.1 >= second_pair.1 {
            pair_overlaps += 1;
        } else if second_pair.0 <= first_pair.0 && second_pair.1 >= first_pair.1 {
            pair_overlaps += 1;
        }
        // if first_pair.0 <= second_pair.0 && first_pair.1 >= second_pair.0 {
        //     pair_overlaps += 1;
        // } else if second_pair.0 <= first_pair.0 && second_pair.1 >= first_pair.0 {
        //     pair_overlaps += 1;
        // }
    });

    println!("{}", pair_overlaps)
}
