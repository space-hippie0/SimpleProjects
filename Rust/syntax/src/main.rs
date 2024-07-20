use rand::Rng;
use std::io;

fn main() {
    // get user name
    let mut name = String::new();
    println!("what is your name?");
    separator();
    io::stdin().read_line(&mut name).expect("failed to read line");
    let name = name.trim().to_string(); // remove whitespace and convert to string
    separator();

    // create a Human instance
    let human = Human::new(name);

    // display the human details
    println!("hej {}, molto piacere!", human.name);
    separator();

    // a random integer between 0-100
    let secret_number = rand::thread_rng().gen_range(0..101);

    // get integer input
    println!("guess an integer between 0-100:");
    separator();
    let mut guess = String::new();
    io::stdin().read_line(&mut guess).expect("failed to read line");
    let guess: u32 = guess.trim().parse().expect("please type a number!");
    separator();

    // check input
    if guess == secret_number {
        println!("you win!");
    } else {
        println!("you lose! correct number was {}", secret_number);
    }
    separator();

    // a 9x9 matrix for some reason
    let mut matrix = vec![vec![String::new(); 9]; 9];
    for i in 0..9 {
        for j in 0..9 {
            matrix[i][j] = if i < 3 {
                to_alphanumeric(i * 9 + j)
            } else {
                to_number(j)
            };
        }
    }

    // print the matrix
    println!("9x9 matrix:");
    separator();
    for row in matrix {
        println!("{}", row.join(" | "));
    }

    // print the Human struct details
    separator();
    println!("Human:");
    separator();
    println!("name --> {}", human.name);
    println!("height --> {} m", human.height);
    println!("weight --> {} kg", human.weight);
    separator();
}

// print line separator
fn separator() {
    println!("{}", "_".repeat(36));
}

// convert a number to its alphanumeric equivalent for the first three rows
fn to_alphanumeric(mut n: usize) -> String {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let base = chars.len();
    let mut result = String::new();

    if n == 0 {
        return chars.chars().nth(0).unwrap().to_string(); // Handle 0 case explicitly
    }

    while n >= base {
        result.insert(0, chars.chars().nth(n % base).unwrap());
        n = n / base;
    }
    result.insert(0, chars.chars().nth(n).unwrap());

    result
}

// convert a number to its single-digit string for rows 4 to 9
fn to_number(n: usize) -> String {
    let digits = "123456789";
    digits.chars().nth(n % 9).unwrap().to_string()
}

struct Human {
    name: String,
    height: f32,
    weight: u32,
}

impl Human {
    fn new(name: String) -> Self {
        let mut rng = rand::thread_rng();
        let height = 1.0 + rng.gen_range(0..101) as f32 / 100.0;
        let weight = rng.gen_range(0..101) * 2;
        Human {
            name,
            height,
            weight,
        }
    }
}
