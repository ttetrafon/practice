import pandas as pd

filter = [
    "TEAM To Score",
    "Draw No Bet"
]

df = pd.DataFrame({
    "Market": ["Something Other", "AEK To Score", "Draw No Bet", "Something Different"],
    "Score": [15, 31, 62, 48]
})

print(df)

def fun(market):
    sanitised_filter = list(map(lambda x: x.replace("TEAM ", ""), filter))
    for f in sanitised_filter:
        if f in market:
            return True
    return False

print(df.apply(lambda row: fun(row["Market"]), axis = 1))

filtered_df = df.loc[
    df.apply(lambda row: fun(row["Market"]), axis = 1)
]
print(filtered_df)
