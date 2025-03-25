import UserLayout from '../generalUsages/UserLayout'
import BookIntro from '../components/BookIntro'

export default function BookPage({bookId})
{
    return(
        <UserLayout>
            <BookIntro
                bookId={bookId}
            />
        </UserLayout>
    )
}