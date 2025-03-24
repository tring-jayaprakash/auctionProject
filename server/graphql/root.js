const { Pool } = require('pg')
const bcrypt = require('bcryptjs')


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "players-auctions",
    password: "1234",
    port: 5432,
})

var id;


const root = {

    getUser: async () => {
        const result = await pool.query("SELECT *  FROM userDetail")
        console.log(result.rows);
        return result.rows;
    },
    register: async ({ city, ph_number, user_name, email, password }) => {
        const hashedPassword = await bcrypt.hash(password, 10)
        try {
            const result = await pool.query("INSERT INTO userDetail (city, ph_number, user_name, email, password) VALUES ($1,$2, $3, $4, $5);",
                [city, ph_number, user_name, email, hashedPassword]
            )
            return "User registered successfully!";
        } catch (error) {
            console.log("register error" + error.message);
            throw new Error("Registration failed: " + error.message);
        }
    },

    login: async ({ email, password }) => {
        try {
            const result = await pool.query("SELECT * FROM userDetail WHERE email = $1", [email]);

            if (result.rows.length === 0) {
                throw new Error("User not found");
            }
            const user = result.rows[0]
            console.log(user);
            id = user.user_id;

        
            const dehashPassword = await bcrypt.compare(password, user.password)
            console.log(dehashPassword);
            if (!dehashPassword) {
                throw new Error("Invalid credentials");
            }
            return result.rows[0];
        } catch (err) {
            console.error("Login error:", err);
            throw new Error("Login failed: " + err.message);
        }
    },
    addAuction: async ({ logo, sports, auction_name, date, time, base_bit, bit_increse_by, max_player, min_player, user_id }) => {
        try {
            const query = `
            INSERT INTO auction (
              logo, sports, auction_name, date, time, base_bit, bit_increse_by, max_player, min_player, user_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING auction_id;
            `;
            const values = [logo, sports, auction_name, date, time, base_bit, bit_increse_by, max_player, min_player, user_id];
            const result = await pool.query(query, values);
            if (result.rows.length === 0) {
                throw new Error("Failed to insert auction: No data returned.");
            }

            return `Auction added successfully with ID: ${result.rows[0].auction_id}`;
        } catch (err) {
            console.error("Auction insertion error:", err);
            throw new Error("Failed to add auction: " + err.message);
        }
    },
    getAuction: async () => {
        try {
            const result = await pool.query("SELECT *  FROM auction")
            console.log(result.rows);
            return result.rows;
        } catch (error) {
            throw Error("Faild to get auction")
        }
    },
    getAuctionByUserId: async ({ user_id }) => {
        try {
            const result = await pool.query("SELECT *  FROM auction WHERE user_id = $1", [user_id])
            console.log(result.rows);
            return result.rows;
        } catch (error) {
            throw Error("Faild to get auction")
        }

    },
    getAuctionByauction_id: async ({ auction_id }) => {
        try {
            const result = await pool.query("SELECT *  FROM auction WHERE auction_id = $1", [auction_id])
            console.log(result.rows);
            return result.rows;
        } catch (error) {
            throw Error("Faild to get auction")
        }
    },
    deleteAuction: async ({ auction_id }) => {
        try {
            const result = await pool.query("DELETE FROM auction WHERE auction_id = $1 RETURNING *", [auction_id]);

            if (result.rows.length === 0) {
                throw new Error("Auction not found or already deleted.");
            }

            return `Auction with ID ${auction_id} deleted successfully!`;
        } catch (err) {
            console.error("Error deleting auction:", err.message);
            throw new Error("Failed to delete auction: " + err.message);
        }
    },
    updateAuction: async ({ auction_id, logo, sports, auction_name, date, time, base_bit, bit_increse_by, max_player, min_player }) => {
        try {
            const query = `
            UPDATE auction 
            SET 
                logo = COALESCE($1, logo),
                sports = COALESCE($2, sports),
                auction_name = COALESCE($3, auction_name),
                date = COALESCE($4, date),
                time = COALESCE($5, time),
                base_bit = COALESCE($6, base_bit),
                bit_increse_by = COALESCE($7, bit_increse_by),
                max_player = COALESCE($8, max_player),
                min_player = COALESCE($9, min_player)
            WHERE auction_id = $10
            RETURNING *;
            `;

            const values = [logo, sports, auction_name, date, time, base_bit, bit_increse_by, max_player, min_player, auction_id];
            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                throw new Error("Auction not found or update failed.");
            }

            return `Auction with ID ${auction_id} updated successfully!`;
        } catch (err) {
            console.error("Error updating auction:", err.message);
            throw new Error("Failed to update auction: " + err.message);
        }
    },
    updateAuctionStatus: async ({ auction_id, auction_status }) => {
        try {
            const query = `
            UPDATE auction 
            SET auction_status = $1
            WHERE auction_id = $2
            RETURNING *;
            `;

            const values = [auction_status, auction_id];
            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                throw new Error("Auction not found or update failed.");
            }

            return `Auction with ID ${auction_id} status updated to ${auction_status} successfully!`;
        } catch (err) {
            console.error("Error updating auction status:", err.message);
            throw new Error("Failed to update auction status: " + err.message);
        }
    },
    getTeams: async () => {
        try {
            const result = await pool.query("SELECT * FROM team");
            console.log(result.rows);
            return result.rows;
        } catch (error) {
            throw new Error(error.message);
        }
    },
    addTeam: async ({ team_logo, team_name, team_short_name, auction_id }) => {
        try {
            const result = await pool.query(
                "INSERT INTO team (team_logo, team_name, team_short_name, auction_id) VALUES ($1, $2, $3, $4) RETURNING *",
                [team_logo, team_name, team_short_name, auction_id]
            );
            return result.rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    },
    updateTeam: async ({ team_id, team_logo, team_name, team_short_name, auction_id }) => {
        try {
            const query = `
                UPDATE team
                SET 
                    team_logo = COALESCE($1, team_logo),
                    team_name = COALESCE($2, team_name),
                    team_short_name = COALESCE($3, team_short_name),
                    auction_id = COALESCE($4, auction_id)
                    WHERE team_id = $5
                    RETURNING *;
            `;

            const values = [team_logo, team_name, team_short_name, auction_id, team_id];

            const result = await pool.query(query, values);

            if (result.rows.length === 0) {
                throw new Error("Team not found or update failed.");
            }

            return result.rows[0];
        } catch (err) {
            console.error("Error updating team:", err.message);
            throw new Error("Failed to update team: " + err.message);
        }
    },
    deleteTeam: async ({ team_id }) => {
        try {
            await pool.query("DELETE FROM team WHERE team_id = $1", [team_id]);
            return "Team deleted successfully";
        } catch (error) {
            throw new Error(error.message);
        }
    },
    getTeamsByAuction: async ({ auction_id }) => {

        try {
            console.log(auction_id);
            const result = await pool.query(
                "SELECT * FROM team WHERE auction_id = $1 ORDER BY team_id",
                [auction_id]
            );
            console.log(result.rows);
            return result.rows;
        } catch (error) {
            throw new Error("Error fetching teams for the auction");
        }


    },
    getPlayers: async () => {
        try {
            const result = await pool.query("SELECT * FROM player")
            console.log(result.rows);
            return result.rows
        } catch (error) {
            throw new Error(error.message);
        }
    },
    getPlayersByTeam: async ({ team_id }) => {
        try {
            const result = await pool.query(`SELECT * FROM player WHERE team_id = $1`,[team_id]);

            if (result.rows.length === 0) {
                throw new Error("No players found for this team.");
            }

            return result.rows; 
        } catch (error) {
            console.error("Error fetching players:", error.message);
            throw new Error("Failed to fetch players: " + error.message);
        }
    },
    getPlayersByAuction: async ({ auction_id }) => {

        try {
            const result = await pool.query("SELECT * FROM player WHERE auction_id = $1 ", [auction_id])
            console.log(result.rows);
            return result.rows
        } catch (error) {
            throw new Error(error.message);
        }
    },
    getPlayersByAuctionTeamNull: async ({ auction_id }) => {

        try {
            const result = await pool.query("SELECT * FROM player WHERE auction_id = $1 AND  team_id IS null", [auction_id])
            console.log(result.rows);
            return result.rows
        } catch (error) {
            throw new Error(error.message);
        }
    },
    addPlayer: async ({ player_pic, player_name, father_name, player_ph_number, age, form_number, player_style, team_id, auction_id }) => {
        try {
            const result = await pool.query(
                `INSERT INTO player 
                 (player_pic, player_name, father_name, player_ph_number, age, form_number, player_style, team_id, auction_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
                 RETURNING *`,
                [player_pic, player_name, father_name, player_ph_number, age, form_number, player_style, team_id, auction_id]
            );
            console.log(result.rows);
            return result.rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    },
    updatePlayer: async ({ player_id, player_pic, player_name, father_name, player_ph_number, age, form_number, player_style, team_id }) => {
        try {
            const result = await pool.query(
                `UPDATE player 
                 SET player_pic = COALESCE($1, player_pic), 
                     player_name = COALESCE($2, player_name),
                     father_name = COALESCE($3, father_name),
                     player_ph_number = COALESCE($4, player_ph_number),
                     age = COALESCE($5, age), 
                     form_number = COALESCE($6, form_number), 
                     player_style = COALESCE($7, player_style),
                     team_id = COALESCE($8, team_id)
                 WHERE player_id = $9 
                 RETURNING *`,
                [player_pic, player_name, father_name, player_ph_number, age, form_number, player_style, team_id, player_id]
            );

            if (result.rowCount === 0) {
                throw new Error("Player not found or update failed.");
            }

            return result.rows[0];
        } catch (error) {
            console.error("Error updating player:", error.message);
            throw new Error("Failed to update player.");
        }
    },
    deletePlayer: async ({ player_id }) => {
        try {
            const result = await pool.query(
                "DELETE FROM player WHERE player_id = $1 RETURNING *",
                [player_id]
            )

            if (result.rowCount === 0) {
                throw new Error("Player not found or already deleted.");
            }

            return `Player with ID ${player_id} deleted successfully.`;
        } catch (error) {
            console.error("Error deleting player:", error.message);
            throw new Error("Failed to delete player.");
        }
    },


    updatePlayerForTeam: async ({ player_id, team_id, bid_amount }) => {
        try {
            const result = await pool.query("UPDATE player SET bid_amount = $3, team_id = $2 WHERE player_id = $1", [player_id, team_id, bid_amount])
            if (result.rowCount === 0) {
                throw new Error("Player not found or already deleted.");
            }
            return `Player with ID ${player_id} Updated successfully.`
        } catch (error) {
            console.error("Error deleting player:", error.message);
            throw new Error("Failed to delete player.");
        }
    },
    updateTeamBudget: async ({ auction_id, budget, total_budget }) => {
        try {
            const result = await pool.query("update team set budget = $2 , total_budget =$3 where auction_id =$1", [auction_id, budget, total_budget])
            if (result.rowCount === 0) {
                throw new Error("Player not found or already deleted.");
            }
            return `Updated successfully.`
        } catch (error) {
            console.error("Failed to Update player:", error.message);
            throw new Error("Failed to Update player.");
        }

    },
    updateTeamBudgetByTeamId: async ({ team_id, budget }) => {
        try {
            const result = await pool.query("UPDATE team  SET budget = CAST(budget AS INTEGER) - $2 WHERE team_id = $1", [team_id, budget])
            if (result.rowCount === 0) {
                throw new Error("Player not found or already deleted.");
            }
            return `Updated successfully.`
        } catch (error) {
            console.error("Failed to Update player :", error.message);
            throw new Error("Failed to Update player.");
        }

    }



}

module.exports = root