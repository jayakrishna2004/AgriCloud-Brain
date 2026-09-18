import sys
import json

from workload_predictor import WorkloadPredictor


def main():

    if len(sys.argv) < 2:

        print(
            "Usage: python predict.py "
            "'{\"cpu\":70,\"memory\":60,\"workload\":75}'"
        )

        return

    input_data = json.loads(
        sys.argv[1]
    )

    predictor = WorkloadPredictor()

    result = predictor.predict(
        input_data
    )

    print(
        json.dumps(
            result,
            indent=2
        )
    )


if __name__ == "__main__":
    main()