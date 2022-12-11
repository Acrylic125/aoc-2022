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
    let mut lines = data.split("\n");

    let mut total_priorities: u32 = 0;

    // Loop through every 3 lines
    for _ in 0.. {
        let line1 = lines.next().unwrap();
        if line1 == "" {
            break;
        }
        let line2 = lines.next().unwrap();
        let line3 = lines.next().unwrap();

        for c in line1.chars() {
            if line2.contains(c) && line3.contains(c) {
                total_priorities += to_priority(c);
                break;
            }
        }
    }

    println!("{}", total_priorities)
}
