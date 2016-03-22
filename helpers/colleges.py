import sys
import json
import csv

datafile = sys.argv[1]
collegesfile = 'colleges.json'

with open(datafile, 'rb') as csvfile:
	reader = csv.DictReader(csvfile)
	college_dict = []
	for row in reader:
		if row['ICLEVEL'] == '1' and row['PSEFLAG'] == '1' and row['UGOFFER'] == '1':
			college_dict.append({
				'value' : row['INSTNM'],
				'alias' : row['IALIAS']
			})

	with open(collegesfile, 'w') as outfile:
		 json.dump(college_dict, outfile)
