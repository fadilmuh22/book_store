export const ShimmerCard: React.FC = () => {
    return (
        <div className="shimmer-card">
            <div className="shimmerBG media"></div>
            <div className="p-32">
                <div className="shimmerBG title-line"></div>

                <div className="shimmerBG content-line m-t-24"></div>
                <div className="shimmerBG content-line"></div>
                <div className="shimmerBG content-line end"></div>

                <div className="d-flex justify-content-between">
                    <div className="shimmerBG title-line w-25"></div>
                    <div className="shimmerBG title-line w-25"></div>
                </div>
            </div>
        </div>
    );
}