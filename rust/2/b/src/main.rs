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

fn get_state(char: &str) -> RPSResult {
    match char {
        "X" => RPSResult::Lose,
        "Y" => RPSResult::Draw,
        "Z" => RPSResult::Win,
        _ => panic!("Invalid RPS"),
    }
}

fn get_rps_by_state(opp: &RPS, state: &RPSResult) -> RPS {
    match (opp, state) {
        (RPS::Rock, RPSResult::Draw) => RPS::Rock,
        (RPS::Rock, RPSResult::Lose) => RPS::Scissors,
        (RPS::Rock, RPSResult::Win) => RPS::Paper,
        (RPS::Paper, RPSResult::Draw) => RPS::Paper,
        (RPS::Paper, RPSResult::Lose) => RPS::Rock,
        (RPS::Paper, RPSResult::Win) => RPS::Scissors,
        (RPS::Scissors, RPSResult::Draw) => RPS::Scissors,
        (RPS::Scissors, RPSResult::Lose) => RPS::Paper,
        (RPS::Scissors, RPSResult::Win) => RPS::Rock,
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
            let opp_play = iter.next().unwrap();
            let result_play = iter.next().unwrap();

            let opp = resolve_str(opp_play);
            let result = get_state(result_play);

            let player = get_rps_by_state(&opp, &result);
            // let result = play_rps(&player, &opp);

            println!(
                "{:?} {:?} Player: {:?}, Opponent: {:?}, Result: {:?}",
                opp_play, result_play, player, opp, result
            );
            let score = result as i32 + player as i32;
            score
        })
        .map(|a| {
            println!("Score: {}", a);
            a
        })
        .reduce(|a, b| a + b);
    println!("Score: {}", score.unwrap());
}
