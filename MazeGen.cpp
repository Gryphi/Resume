#include <iostream>
#include <vector>
using namespace std;
using std::cout;

int main() {
	//user gives rows and cols
	int r;
	cout << "Please enter number of rows: ";
	cin >> r;
	
	int c;
	cout << "Please enter number of cols: ";
	cin >> c;
	
	const int rows = r;
	const int cols = c;

	//maze
	int cells[rows][cols];
	
	srand (time(NULL));
	int start = rand() % 4;
	
	int start_row = 0;
	int end_row = 0;
	int start_col = 0;
	int end_col = 0;
	
	// init cells
	for (int row = 0; row < rows; row++) {
		for (int col = 0; col < cols; col++) {
			cells[row][col] = 0;
		}
	}
		
	//random start and end with path
	if (start == 0){ 
		start_row = rand() % (rows - 1); //any row
		start_col = cols - cols; //first column
		end_row = rows - 1; //last row
		end_col = rand() % (cols - 1) + 1; //any column
		std::cout << endl;

		// generate path
		int row = start_row;
		int col = start_col;
		while ((col < end_col) || (row < end_row)) {
			// direction 0=R, 1=D
			int move = (rand() % 2);
			if(move && (row < end_row)){
				// moving down
				cells[row++][col]=1;
			} else if(!move && (col < end_col)){
				// moving right
				cells[row][col++]=1;
			}
		}
	} else if (start == 1){
		start_row = rows - rows; //first row
		start_col = rand() % (cols - 1);//any column
		end_row = rand() % (rows - 1) + 1;//any row
		end_col = cols - 1;//last column

		// generate path
		int row = start_row;
		int col = start_col;
		while ((col < end_col) || (row < end_row)) {
			// direction 0=R, 1=D
			int move = (rand() % 2);
			if(move && (row < end_row)){
				// moving down
				cells[row++][col]=1;
			} else if(!move && (col < end_col)){
				// moving right
				cells[row][col++]=1;
			}
		}
	
	} else if (start == 2){ 
		start_row = rows - 1;//last row
		start_col = rand() % (cols - 1) + 1;//any column
		end_row = rand() % (rows - 1);//any row
		end_col = cols - cols;//first column

		// generate path
		int row = start_row;
		int col = start_col;
		while ((col > end_col) || (row > end_row)) {
			// direction 0=L, 1=U
			int move = (rand() % 2);
			if(move && (row > end_row)){
				// moving down
				cells[row--][col]=1;
			} else if(!move && (col > end_col)){
				// moving right
				cells[row][col--]=1;
			}
		}
	} else { 
		start_row = rand() % (rows - 1) + 1;//any row
		start_col = cols - 1;//last column
		end_row = rows - rows;//first row
		end_col = rand() % (cols - 1);//any column

		// generate path
		int row = start_row;
		int col = start_col;
		while ((col > end_col) || (row > end_row)) {
			// direction 0=L, 1=U
			int move = (rand() % 2);
			if(move && (row > end_row)){
				// moving down

				cells[row--][col]=1;
			} else if(!move && (col > end_col)){
				// moving right
				cells[row][col--]=1;
			}
		}
	}		
	
	//set start and end cells
	cells[start_row][start_col] = 2;
	cells[end_row][end_col] = 3;

	
	// printout
	for (int row = 0; row < rows; row++) {
		for (int col = 0; col < cols; col++) {
			std::cout << cells[row][col];
		}
		std::cout << endl;
	}
	

	// solve
	int cRow = start_row;
	int cCol = start_col;
	
	bool used[rows][cols];
	
	//init used
	for (int row = 0; row < rows; row++) {
		for (int col = 0; col < cols; col++) {
			used[row][col] = false;
		}
	}
	
	used[start_row][start_col] = true;
	
	while (cells[cRow][cCol] != 3){
		if (cCol < cols - 1 && !used[cRow][cCol + 1] && (cells[cRow][cCol + 1] == 1 || cells[cRow][cCol + 1] == 3)){
			cout << "R ";
			cCol++;
		} else if (cCol > 0 && !used[cRow][cCol - 1] && (cells[cRow][cCol - 1] == 1 || cells[cRow][cCol - 1] == 3)){
			cout << "L ";
			cCol--;
		} else if (cRow < rows - 1 && !used[cRow + 1][cCol] && (cells[cRow + 1][cCol] == 1 || cells[cRow + 1][cCol] == 3)){
			cout << "D ";
			cRow++;
		} else if (cRow > 0 && !used[cRow - 1][cCol] && (cells[cRow - 1][cCol] == 1 || cells[cRow - 1][cCol] == 3)){
			cout << "U ";
			cRow--;
		}

		used[cRow][cCol] = true;
	}
}