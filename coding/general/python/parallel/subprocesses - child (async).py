from datetime import datetime
import sys, time

def main(arg1):
    print('This is an async subprocess...:', arg1)
    time.sleep(10)
    print('... subprocess', arg1, 'finished...')
    with open('./sub_' + arg1 + '.txt', 'w') as output:
        now = datetime.now()
        formatted_date = now.strftime('%Y-%m-%d %H:%M:%S')
        output.write('[' + formatted_date + '] ... subprocess ' + arg1 + ' finished...')

if __name__ == "__main__":
    main(sys.argv[1])
