// import { Server } from 'http';
// import { NextApiResponse } from 'next';
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { v4 as uuidv4 } from 'uuid';

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   if (request.nextUrl.pathname.startsWith('/api/map')) {
//     const id = uuidv4()
//     const requestHeaders = new Headers(request.headers)
//     requestHeaders.set('uuid', id)
//     const response = NextResponse.next({
//       request: {
//         // New request headers
//         headers: requestHeaders,
//       },
//     })
//     response.headers.set('uuid', id)
//     return response
//   }
//   else {
//     return NextResponse.next()
//   }
// }