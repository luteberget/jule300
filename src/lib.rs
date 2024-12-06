use std::collections::HashMap;

struct Session {
    date: u32,
    activity_type: u32,
    km: u32,
}

fn solve(all_sessions_str: &str) -> String {
    let mut all_sessions: Vec<Session> = Default::default();
    for line in all_sessions_str.lines() {
        let fields = line.split(';').collect::<Vec<_>>();
        all_sessions.push(Session {
            date: fields[0].parse().unwrap(),
            activity_type: fields[1].parse().unwrap(),
            km: fields[2].parse().unwrap(),
        })
    }

    let mut problem = highs::RowProblem::new();
    let mut km_by_session: HashMap<(u32, u32), u32> = Default::default();
    for Session {
        date,
        km,
        activity_type,
    } in all_sessions
    {
        *km_by_session.entry((date, activity_type)).or_default() += km;
    }

    let virtual_day_from_day = (1..=24)
        .map(|virtual_day| {
            (
                virtual_day,
                km_by_session
                    .keys()
                    .map(|date| {
                        (
                            *date,
                            problem.add_column_with_integrality(
                                1.0 * (virtual_day as f64)
                                    + 0.0001 * ((virtual_day * virtual_day) as f64),
                                0.0..1.0,
                                true,
                            ),
                        )
                    })
                    .collect::<HashMap<(u32, u32), _>>(),
            )
        })
        .collect::<Vec<_>>();

    // Constraints

    // Virtual day is satisfied at most once and by at most one day
    for (_vday, days) in virtual_day_from_day.iter() {
        problem.add_row(..1.0, days.iter().map(|(_, v)| (*v, 1.0)));
    }

    // A day contributes with a maximum number of kms
    for (session, km) in km_by_session.iter() {
        problem.add_row(
            ..(*km as f64),
            virtual_day_from_day
                .iter()
                .map(|(vday, sessions)| (sessions[session], *vday as f64)),
        );
    }

    let m = problem.optimise(highs::Sense::Maximise);
    let s = m.solve();
    let solution = s.get_solution();
    println!("status {:?}", s.status());

    // let vdays = virtual_day_from_day
    //     .iter()
    //     .map(|(vday, days)| {
    //         (
    //             *vday,
    //             days.iter()
    //                 .filter(|&(_d, v)| (solution[*v] > 0.5))
    //                 .map(|(d, _v)| *d)
    //                 .next(),
    //         )
    //     })
    //     .collect();

    let mut output = String::new();
    for (vday, days) in virtual_day_from_day.iter() {
        for ((day, act), v) in days {
            if solution[*v] > 0.5 {
                // days_output.push((*day,*act,*vday));
                output.push_str(&format!("{};{};{}\n", day, act, vday));
            }
        }
    }
    output.pop();
    output
}

#[test]
fn test1() {
    let mut total = 0;
    let mut luker = 0;
    let input = "1;0;25\n2;0;10\n3;0;23\n4;0;13";
    println!("{:?} -----> {:?}", input, solve(input));
    for line in solve(input).lines() {
        let fields = line.split(';').collect::<Vec<_>>();
        let day: u32 = fields[0].parse().unwrap();
        let activity_type: u32 = fields[1].parse().unwrap();
        let vday: u32 = fields[2].parse().unwrap();
        total += vday;
        luker += 1;
        println!("vday {} -- day {:?}", vday, day);
    }
    println!("  luker: {}, poeng: {}", luker, total);
}
