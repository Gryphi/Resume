#include <iostream>
using namespace std;
using std::cout;

class MazeFinal {
	public:
		void fillCells();
	private:
		const int rows;
		const int cols;
		int cells[rows][cols];
};



//fill cells with walls
void MazeFinal::fillCells(){
	for (int row = 0; row < rows; row++) {
		for (int col = 0; col < cols; col++) {
			cells[row][col] = 0;
		}
	}
}
	
	

int main() {
	int r;
	cout << "Please enter number of rows: ";
	cin >> r;
	
	int c;
	cout << "Please enter number of cols: ";
	cin >> c;
	
	rows = r;
	cols = c;

	//maze
	fillCells();
}
/*
	
	srand (time(NULL));
	int start = rand() % 4;
	
	int start_row = 0;
	int end_row = 0;
	int start_col = 0;
	int end_col = 0;

	//random start and end with path
	if (start == 0){ 
		start_row = rand() % (this->rows - 1);
		start_col = this->cols - this->cols;
		end_row = this->rows - 1;
		end_col = rand() % (this->cols - 1) + 1;
		std::cout << endl;

		// generate path
		int row = start_row;
		int col = start_col;
		while ((col < end_col) || (row < end_row)) {
			// direction 0=R, 1=D
			int move = (rand() % 2);
			if(move && (row < end_row)){
				// moving down
				this->cells[row++][col]=1;
			} else if(!move && (col < end_col)){
				// moving right
				this->cells[row][col++]=1;
			}
		}
	} else if (start == 1){
		start_row = this->rows - this->rows;
		start_col = rand() % (this->cols - 1);
		end_row = rand() % (this->rows - 1) + 1;
		end_col = this->cols - 1;

		// generate path
		int row = start_row;
		int col = start_col;
		while ((col < end_col) || (row < end_row)) {
			// direction 0=R, 1=D
			int move = (rand() % 2);
			if(move && (row < end_row)){
				// moving down
				this->cells[row++][col]=1;
			} else if(!move && (col < end_col)){
				// moving right
				this->cells[row][col++]=1;
			}
		}
	
	} else if (start == 2){ 
		start_row = this->rows - 1;
		start_col = rand() % (this->cols - 1) + 1;
		end_row = rand() % (this->rows - 1);
		end_col = this->cols - this->cols;

		// generate path
		int row = start_row;
		int col = start_col;
		while ((col > end_col) || (row > end_row)) {
			// direction 0=L, 1=U
			int move = (rand() % 2);
			if(move && (row > end_row)){
				// moving down
				this->cells[row--][col]=1;
			} else if(!move && (col > end_col)){
				// moving right
				this->cells[row][col--]=1;
			}
		}
	} else { 
		start_row = rand() % (this->rows - 1) + 1;
		start_col = this->cols - 1;
		end_row = this->rows - this->rows;
		end_col = rand() % (this->cols - 1);

		// generate path
		int row = start_row;
		int col = start_col;
		while ((col > end_col) || (row > end_row)) {
			// direction 0=L, 1=U
			int move = (rand() % 2);
			if(move && (row > end_row)){
				// moving down
				this->cells[row--][col]=1;
			} else if(!move && (col > end_col)){
				// moving right
				this->cells[row][col--]=1;
			}
		}
	}		
	
	//set start and end cells
	this->cells[start_row][start_col] = 2;
	this->cells[end_row][end_col] = 3;

	
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
	
	while (this->cells[cRow][cCol] != 3){
		if (cCol < cols - 1 && !used[cRow][cCol + 1] && (this->cells[cRow][cCol + 1] == 1 || this->cells[cRow][cCol + 1] == 3)){
			cout << "R ";
			cCol++;
		} else if (cCol > 0 && !used[cRow][cCol - 1] && (this->cells[cRow][cCol - 1] == 1 || this->cells[cRow][cCol - 1] == 3)){
			cout << "L ";
			cCol--;
		} else if (cRow < rows - 1 && !used[cRow + 1][cCol] && (this->cells[cRow + 1][cCol] == 1 || this->cells[cRow + 1][cCol] == 3)){
			cout << "D ";
			cRow++;
		} else if (cRow > 0 && !used[cRow - 1][cCol] && (this->cells[cRow - 1][cCol] == 1 || this->cells[cRow - 1][cCol] == 3)){
			cout << "U ";
			cRow--;
		}

		used[cRow][cCol] = true;
	}
}
*/