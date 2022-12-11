use std::collections::HashSet;

fn to_priority(char: char) -> u32 {
    let ascii_dec = char as u32;
    if char.is_ascii_uppercase() {
        ascii_dec - 64 + 26
    } else {
        ascii_dec - 96
    }
}

fn main() {
    // Read from data.txt
    let data = std::fs::read_to_string("data.txt").unwrap();

    // Split data into lines
    let lines = data.split("\n");

    let mut total_priorities: u32 = 0;

    lines.for_each(|line| {
        if line == "" {
            return;
        }
        let first_half_of_line = line[..line.len() / 2].to_string();
        let second_half_of_line = line[line.len() / 2..].to_string();

        let mut first_half_set: HashSet<char> = HashSet::with_capacity(first_half_of_line.len());
        for c in first_half_of_line.chars() {
            first_half_set.insert(c);
        }

        let mut common_char: char = ' ';
        for c in second_half_of_line.chars() {
            if first_half_set.contains(&c) {
                common_char = c;
                break;
            }
        }
        if common_char == ' ' {
            println!(
                "No common char found {} {}",
                first_half_of_line, second_half_of_line
            );
        }

        total_priorities += to_priority(common_char);

        println!("First half: {}", first_half_of_line);
        println!("Second half: {}", second_half_of_line);
    });

    println!("{}", total_priorities)
}
