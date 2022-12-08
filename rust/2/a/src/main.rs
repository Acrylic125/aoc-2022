// Debg
#[derive(Debug)]
enum RPS {
    Rock = 1,
    Paper = 2,
    Scissors = 3,
}

#[derive(Debug)]
enum RPSResult {
    Win = 6,
    Draw = 3,
    Lose = 0,
}

fn resolve_str(s: &str) -> RPS {
    match s {
        "A" | "X" => RPS::Rock,
        "B" | "Y" => RPS::Paper,
        "C" | "Z" => RPS::Scissors,
        _ => panic!("Invalid RPS"),
    }
}

fn play_rps(player: &RPS, opp: &RPS) -> RPSResult {
    match (player, opp) {
        (RPS::Rock, RPS::Rock) => RPSResult::Draw,
        (RPS::Rock, RPS::Paper) => RPSResult::Lose,
        (RPS::Rock, RPS::Scissors) => RPSResult::Win,
        (RPS::Paper, RPS::Rock) => RPSResult::Win,
        (RPS::Paper, RPS::Paper) => RPSResult::Draw,
        (RPS::Paper, RPS::Scissors) => RPSResult::Lose,
        (RPS::Scissors, RPS::Rock) => RPSResult::Lose,
        (RPS::Scissors, RPS::Paper) => RPSResult::Win,
        (RPS::Scissors, RPS::Scissors) => RPSResult::Draw,
    }
}

fn main() {
    // Read from data.txt
    let data = std::fs::read_to_string("data.txt").unwrap();

    let score = data
        .split("\n")
        .filter(|line| line.len() > 0)
        .map(|line| {
            let mut iter = line.split(" ");
            let opp = resolve_str(iter.next().unwrap());
            let player = resolve_str(iter.next().unwrap());
            let result = play_rps(&player, &opp);

            println!(
                "Player: {:?}, Opponent: {:?}, Result: {:?}",
                player, opp, result
            );
            result as i32 + player as i32
        })
        .reduce(|a, b| a + b);
    println!("Score: {}", score.unwrap());
}
